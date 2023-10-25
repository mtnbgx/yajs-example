import axios from 'axios'
import type { FUNCAPP, FUNCCTX } from '../context'
const ctx: FUNCCTX = _CTX
const app: FUNCAPP = _APP

// 基金代码
const code = '012414'
//企业微信api
const qyApi = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx'

// http访问时输出
export const main = async () => {
    const { name, price, ratio } = await getFundData(code)
    return { data: { fund: { name, price, ratio } } }
}

// cron定时任务执行方法
export const cron = async () => {
    console.log('cron start')
    const { name, price, ratio } = await getFundData(code)
    if (ratio < -0.2 || ratio > 2) {
        await axios.post(qyApi, {
            "msgtype": "text",
            "text": {
                "content": `请注意${name}基金变动`
            }
        })
    }
}

const getFundData = async (code: string) => {
    const str: string = await axios.get(`http://hqf.stock.sohu.com/kfund/${code}_6.up`)
        .then(res => res.data)
    //剔除fortune_hq( );
    const jsonStr = str.substring(11).slice(0, -3).replace(/\'/g, '"')
    const data = JSON.parse(jsonStr)
    const name = data.price[1]
    const price = parseFloat(data.price[2])
    const ratio = parseFloat(data.price[3])
    const result = { name, price, ratio }
    // 可以db保存起来
    // await ctx.redis.setex(dayjs().format('YYYY-MM-DD') + '-' + code, 7200, JSON.stringify(result))
    // await ctx.knex('fund').insert(result) //先得创建表
    return result
}
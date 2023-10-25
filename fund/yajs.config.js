exports.config = {
    default: {
        project: "test",
        token: "123456",
        url: "http://127.0.0.1:3000",
        secret: {},
        crons: [
            { label: 'fund', name: 'fund', cron: '0 40 14 * * *' }
        ]
    }
}
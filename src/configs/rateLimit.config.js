const rateLimitConfig = {
    limit: {
        upload: 10,
        download: 20,
    },
    prefix: "ipconn",
    resetPeriod: " * * * * * ", // a valid unix-cron string --- this example runs every minute
    // resetPeriod: " 0 0 * * * ", // a valid unix-cron string --- this example runs on the 0th minute of the 0th hour of every day
    // resetPeriod: "0,10,20,30,40,50 * * * * * ", // a valid unix-cron string --- this example runs every 10 seconds
};

module.exports = rateLimitConfig;

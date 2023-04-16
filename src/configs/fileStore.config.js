const fileStoreConfig = {
    prefix: "file",
    maxAge: 60 * 1000, // 1 Minute
    resetPeriod: "* * * * * ", // a valid unix-cron string --- this example runs every minute
    // resetPeriod: "0,10,20,30,40,50 * * * * * ", // a valid unix-cron string --- this example runs every 10 seconds
};

module.exports = fileStoreConfig;

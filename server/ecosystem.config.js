module.exports = {
  apps: [
    {
      name: 'upchat-app',
      script: './src/index.js',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'worker',
      script: 'worker.js',
    },
  ],
};

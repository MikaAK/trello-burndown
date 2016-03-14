export default {
  production() {
    process.env.NODE_ENV = 'production'
    process.env.MIX_ENV = 'prod'
  },

  development() {
    process.env.NODE_ENV = 'development'
    process.env.MIX_ENV = 'dev'
  },

  staging() {
    process.env.NODE_ENV = 'staging'
    process.env.MIX_ENV = 'prod'
  }
}

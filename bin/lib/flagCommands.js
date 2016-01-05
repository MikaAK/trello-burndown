export default {
  production() {
    process.env.NODE_ENV = 'production'
  },

  development() {
    process.env.NODE_ENV = 'development'
  },

  staging() {
    process.env.NODE_ENV = 'staging'
  }
}

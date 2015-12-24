export default {
  production() {
    process.env.NODE_ENV = 'production'
  },

  development() {
    process.env.NODE_ENV = 'develepment'
  },

  staging() {
    process.env.NODE_ENV = 'staging'
  }
}

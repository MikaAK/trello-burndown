declare const __DEV__: boolean

export const Config = {
  websocketUrl: __DEV__ ? 'ws://localhost:3000/socket' : '/socket',
  holidaysFormat: 'MM-DD',
  LABEL_MAP: {
    small: __SMALL_LABEL_NAME__,
    medium: __MEDIUM_LABEL_NAME__,
    large: __LARGE_LABEL_NAME__,
    extraLarge: __EXTRA_LARGE_LABEL_NAME__
  }
}

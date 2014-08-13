/**
 * File upload configs
 * (sails.config.upload)
 *
 */

module.exports.upload = {
  image: {

    availableStyles: [
      'mini',
      'thumbnail',
      'medium',
      'large'
    ],

    styles: {
      mini: {
        width: '24',
        height: '24'
      },
      thumbnail: {
        width: '75',
        height: '75'
      },
      medium: {
        width: '250',
        height: '250'
      },
      large: {
        width: '640',
          height: '640'
      }
    }
  },

};

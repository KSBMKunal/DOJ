export const actions = [
    {
      title: 'Camera',
      type: 'camera-alt',
      options: {
        maxWidth: 300,
        maxHeight: 300,
        // saveToPhotos: true,
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.2,
      },
    },
    {
      title: 'Select Photo From Gallery',
      type: 'photo-album',
      options: {
        maxWidth: 300,
        maxHeight: 300,
        selectionLimit: 1,
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.2,
      },
    },
  ];
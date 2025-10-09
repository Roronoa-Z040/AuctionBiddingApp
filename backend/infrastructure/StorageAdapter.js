/**
 * Adapter Pattern: Abstract storage provider (Local now, S3 later).
 */
class LocalStorageAdapter {
  constructor(baseUrl = '/uploads') { this.baseUrl = baseUrl; }
  getPublicUrl(filename) { return `${this.baseUrl}/${filename}`; }
}

class S3StorageAdapter {
  constructor({ bucket, region }) { this.bucket = bucket; this.region = region; }
  getPublicUrl(key) { return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`; }
}

module.exports = { LocalStorageAdapter, S3StorageAdapter };

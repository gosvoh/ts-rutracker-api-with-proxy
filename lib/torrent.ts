import { formatSize } from "./utils";

export interface TorrentOptions {
  author?: string;
  category?: string;
  id?: string;
  leeches?: number;
  seeds?: number;
  size?: number;
  state?: string;
  title?: string;
  downloads?: number;
  registered?: Date;
  imageUri?: string;
  url: string;
}

export default class Torrent {
  static APPROVED: string = "проверено";
  static NOT_APPROVED: string = "не проверено";
  static NEED_EDIT: string = "недооформлено";
  static DUBIOUSLY: string = "сомнительно";
  static CONSUMED: string = "поглощено";
  static TEMPORARY: string = "временная";

  author?: string;
  category?: string;
  id?: string;
  leeches?: number;
  seeds?: number;
  size?: number;
  state?: string;
  title?: string;
  downloads?: number;
  registered?: Date;
  imageUri?: string;
  url: string;

  constructor(options: TorrentOptions) {
    this.author = options.author;
    this.category = options.category;
    this.id = options.id;
    this.leeches = options.leeches;
    this.seeds = options.seeds;
    this.size = options.size;
    this.state = options.state;
    this.title = options.title;
    this.downloads = options.downloads;
    this.registered = options.registered;
    this.imageUri = options.imageUri;
    this.url = options.url;
  }

  get formattedSize() {
    return formatSize(this.size || 0);
  }
}

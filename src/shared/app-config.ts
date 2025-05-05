import packageInfo from "../../package.json" assert { type: "json" };

class AppConfig {
  private _domain: string = "707x.in";
  private _marketName: string = "YTCatalog";
  private _name: string = packageInfo.name;
  private _subDomain: string = "ytcatalog";
  private _version: string = packageInfo.version;
  private _organization: string = "707x Labs";
  private _githubRepo: string = "https://github.com/realChakrawarti/yt-catalog";

  get url(): string {
    return `https://${this._subDomain}.${this._domain}`;
  }

  get domain(): string {
    return this._domain;
  }

  get marketName(): string {
    return this._marketName;
  }

  get name(): string {
    return this._name;
  }

  get subDomain(): string {
    return this._subDomain;
  }

  get version(): string {
    return this._version;
  }

  get organization(): string {
    return this._organization;
  }

  get githubRepo(): string {
    return this._githubRepo;
  }
}

const appConfig = new AppConfig();

export default appConfig;

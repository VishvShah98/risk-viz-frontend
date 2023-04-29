export interface DataPoint {
    _id: string;
    "Asset Name": string;
    Lat: number;
    Long: number;
    "Business Category": string;
    "Risk Rating": number;
    "Risk Factors": string;
    "Year": number;
  }

  export interface GraphDataPoint {
    _id: {
      [key: string]: any;
    };
    "Asset Name": string;
    "Business Category": string;
    "Risk Rating Avg": number;
    "Risk Factors Avg": object;
    "Year": number;
    data: any[]; // add a data property of type any[]
  }

  export interface Decade {
    _id: string;
    Decade: number;
  }
  
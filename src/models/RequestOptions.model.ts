interface RequestOptions {
  url: string;
  method: string;
  data?: any; // or a specific type if you have a defined structure
  params: any; // can be an empty object if not needed
  headers?: any; // or a more specific type if needed
}

export default RequestOptions;

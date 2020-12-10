import XenquBase from "../XenquBase";
import * as fs from "fs";
import * as path from "path";

export default class FilesRoutes {

  /* Global Variables */
  private base: XenquBase;

  constructor() {
    this.base = new XenquBase('');
  }

  update(base: XenquBase) {
    this.base = base;
  }

  /**
   * Download File
   * @see [API Docs]{@link https://apidocs.xenqu.com/#2102ba3f-8a86-4f02-aeb2-3cdfbda3eadc}
   * @param fileId File ID to download
   */
  public downloadFile(fileId: string): Promise<any> {
    return this.base.makeGet('/files/' + fileId + '?out=json');
  }

  /**
   * Upload File
   * File uploads can be chunked or sent in one large chunk. Total file size can be 50Mb
   * fileHandle in the response represents the _temp_handle_id sent to other end points used to attach files to an object.
   * Uploads in predefined chunk sizes asynchronously for fast uploads
   * @see [API Docs]{@link https://apidocs.xenqu.com/#aa314a75-2acb-42f9-9ff4-ad10282ee961}
   * @param filePath Path to file to upload
   * @param encoding Encoding type to use when loading file to upload. Defaults to 'base64'
   * @param isImage if the file is an image, set to true. Default false
   * @param chunkLimit Max Chunk size to use, in bytes. Default is 1000000, or 1 mb
   */
  public uploadFile(filePath: string, encoding: BufferEncoding = "base64", isImage: boolean = false, chunkLimit: number = 1000000): Promise<any> {
    // Get File Data
    const fileData: string = fs.readFileSync(filePath, {encoding: encoding}); // this isn't exactly the fastest way :/
    // Create final file data
    let file: string = fileData.toString();
    // Get Extension and Filename
    const extensionName = path.extname(filePath);
    if(isImage) { // If It's an image, convert to Base64 and then generate the whole uploadable string
      file = `data:image/${extensionName.split('.').pop()};base64,${fileData}`; // Get Img Src String
    } else {
      file = `data:application/${extensionName.split('.').pop()};${encoding},${fileData}`; // Get Src String
    }
    // Chunk up file and generate POST requests
    const promises: Promise<any>[] = [];
    let chunkCounter = 0;
    for (let start = 0; start < file.length; start += chunkLimit) {
      const chunk = file.slice(start, start + chunkLimit + 1)
      const data = {
        "chunkData": chunk,
        "chunkSeq": chunkCounter,
        "chunkStart": start,
        "chunkEnd": start + chunk.length,
        "chunkSize": chunk.length,
        "chunkLimit": chunkLimit,
        "totalSize": file.length,
        "totalChunks": Math.ceil(file.length / chunkLimit) // Calc max number of chunks that we'll need
      }
      promises.push(this.base.makePost("/files", JSON.stringify(data)))
    }
    // Execute all POST requests
    return Promise.all(promises);
  }

}
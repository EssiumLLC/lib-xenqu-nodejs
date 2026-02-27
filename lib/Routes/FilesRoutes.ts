import XenquAPI from "..";
import { FileData } from "../Models/File";
import { FileUploadResponseType } from "../Models/Files";

export default class FilesRoutes {

  /**
   * Download File
   * @see [API Docs]{@link https://apidocs.xenqu.com/#2102ba3f-8a86-4f02-aeb2-3cdfbda3eadc}
   * @param fileId File ID to download
   */
  public downloadFile(fileId: string): Promise<FileData> {
    return XenquAPI.Base.makeGet('/files/' + fileId, {out: 'json'});
  }

  /**
   * Upload File
   * File uploads can be chunked or sent in one large chunk. Total file size can be 50Mb
   * fileHandle in the response represents the _temp_handle_id sent to other end points used to attach files to an object.
   * Uploads in predefined chunk sizes asynchronously for fast uploads
   * @see [API Docs]{@link https://apidocs.xenqu.com/#aa314a75-2acb-42f9-9ff4-ad10282ee961}
   * @param fileData base64 encoded file string. Must be base64 with proper headers (ex. data:image/jpg;base64,<file_data>)
   * @param isImage if the file is an image, set to true. Default false
   * @param chunkLimit Max Chunk size to use, in bytes. Default is 1000000, or 1 mb
   */
  public uploadFile(fileData: string, isImage: boolean = false, chunkLimit: number = 1000000): Promise<FileUploadResponseType[]> {
    // Chunk up file and generate POST requests
    const promises: Promise<FileUploadResponseType>[] = [];
    let chunkCounter = 0;
    for (let start = 0; start < fileData.length; start += chunkLimit) {
      const chunk = fileData.slice(start, start + chunkLimit + 1)
      const data = {
        "chunkData": chunk,
        "chunkSeq": chunkCounter,
        "chunkStart": start,
        "chunkEnd": start + chunk.length,
        "chunkSize": chunk.length,
        "chunkLimit": chunkLimit,
        "totalSize": fileData.length,
        "totalChunks": Math.ceil(fileData.length / chunkLimit) // Calc max number of chunks that we'll need
      }
      promises.push(XenquAPI.Base.makePost("/files", JSON.stringify(data)))
    }
    // Execute all POST requests
    return Promise.all(promises);
  }

}

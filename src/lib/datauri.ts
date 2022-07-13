import DatauriParser from 'datauri/parser';
import path from 'path';
const dataUriParser: any = new DatauriParser();

const dataUri = (req: any) => dataUriParser.format(path.extname(req.file.originalname).toString(), req.file.buffer);

export default dataUri
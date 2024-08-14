import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

export const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: './uploads', // Directory where files will be uploaded
    filename: (req, file, callback) => {
      const uniqueSuffix = uuidv4() + extname(file.originalname);
      callback(null, uniqueSuffix);
    },
  }),
};

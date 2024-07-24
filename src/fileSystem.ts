export type FileType = 'file' | 'directory';
export type FileExtension = 'txt' | 'pdf';

export interface FileSystemItem {
  name: string;
  type: FileType;
  content?: string; // for text files
  extension?: FileExtension;
  children?: FileSystemItem[]; // for directories
}

export const fileSystem: FileSystemItem[] = [
  {
    name: 'documents',
    type: 'directory',
    children: [
      {
        name: 'resume',
        type: 'file',
        extension: 'pdf',
      },
      {
        name: 'aboutme.txt',
        type: 'file',
        extension: 'txt',
        content: 'Hi! I am Sridhar. More to come...',
      },
    ],
  },
  {
    name: 'notes',
    type: 'directory',
    children: [
      {
        name: 'meeting_notes',
        type: 'file',
        extension: 'txt',
        content: 'GSoC Meeting Notes.',
      },
    ],
  },
  {
    name: 'welcome.txt',
    type: 'file',
    extension: 'txt',
    content: 'Welcome to the file system!',
  },
];

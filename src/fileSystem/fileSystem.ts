export type FileType = 'file' | 'directory';
export type FileExtension = 'txt' | 'pdf' | 'md';

export interface FileSystemItem {
  name: string;
  type: FileType;
  path?: string;
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
        path: '/documents/resume.pdf',
      },
      {
        name: 'aboutme.txt',
        type: 'file',
        extension: 'txt',
        path: '/documents/aboutme.txt',
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
        path: '/notes/meeting_notes.txt',
      },
    ],
  },
  {
    name: 'welcome.md',
    type: 'file',
    extension: 'md',
    path: '/welcome.md',
  },
];

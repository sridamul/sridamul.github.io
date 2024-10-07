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
        name: 'aboutme.md',
        type: 'file',
        extension: 'md',
        path: '/documents/aboutme.md',
      },
      {
        name: 'contact.md',
        type: 'file',
        extension: 'md',
        path: '/documents/contact.md',
      },
      {
        name: 'resume.md',
        type: 'file',
        extension: 'md',
        path: '/documents/resume.md',
      },
    ],
  },
  {
    name: 'notes',
    type: 'directory',
    children: [
      {
        name: 'gsoc_meeting_notes.md',
        type: 'file',
        extension: 'md',
        path: '/notes/gsoc_meeting_notes.md',
      },
      {
        name: 'gdoc-links.md',
        type: 'file',
        extension: 'md',
        path: '/notes/gdoc-links.md',
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

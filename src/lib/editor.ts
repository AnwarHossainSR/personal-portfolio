// Define the modules for the editor, including additional toolbar options
// const modules = {
//   toolbar: [
//     [{ header: '1' }, { header: '2' }, { font: [] }],
//     [{ list: 'ordered' }, { list: 'bullet' }],
//     ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//     ['link', 'image', 'video'],
//     [{ align: [] }],
//     [{ color: [] }, { background: [] }],
//     [{ script: 'sub' }, { script: 'super' }],
//     ['code-block'],
//     [{ direction: 'rtl' }],
//     ['clean'], // Remove formatting button
//   ],
// };
export const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction

    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ['clean'], // remove formatting button
  ],
};
export const formats = [
  'header',
  'font',
  'size',
  'list',
  'bullet',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'link',
  'image',
  'video',
  'color',
  'background',
  'align',
  'script',
  'code-block',
  'direction',
];

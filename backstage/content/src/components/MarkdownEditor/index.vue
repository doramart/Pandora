<template>
  <editor
    :ref="id"
    :initialValue="value"
    :options="editorOptions"
    :height="height"
    :initialEditType="mode"
    previewStyle="vertical"
    @change="onEditorChange"
    class="myEditor"
  />
</template>

<script>
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/vue-editor';
import axios from 'axios';

// import Editor from 'tui-editor';
import defaultOptions from './default-options';

export default {
  name: 'MarkdownEditor',
  props: {
    value: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      required: false,
      default() {
        return (
          'markdown-editor-' +
          +new Date() +
          ((Math.random() * 1000).toFixed(0) + '')
        );
      },
    },
    options: {
      type: Object,
      default() {
        return defaultOptions;
      },
    },
    mode: {
      type: String,
      default: 'markdown',
    },
    height: {
      type: String,
      required: false,
      default: '300px',
    },
    language: {
      type: String,
      required: false,
      default: 'zh_CN', // https://github.com/nhnent/tui.editor/tree/master/src/js/langs
    },
  },
  components: {
    editor: Editor,
  },
  data() {
    return {
      editor: null,
      editorText: 'This is initialValue.',
    };
  },
  computed: {
    editorOptions() {
      const options = Object.assign({}, defaultOptions, this.options);
      options.initialEditType = this.mode;
      options.height = this.height;
      options.language = this.language;
      return options;
    },
  },
  mounted() {
    // this.initEditor();
    this.editor = this.$refs[this.id].editor;
    if (this.editor) {
      // 删除默认监听事件
      this.editor.eventManager.removeEventHandler('addImageBlobHook');
      // 添加自定义监听事件
      this.editor.eventManager.listen('addImageBlobHook', (blob, callback) => {
        this.uploadImg(blob, (url) => {
          callback(url);
        });
      });
    }
  },
  destroyed() {
    this.destroyEditor();
  },
  methods: {
    onEditorChange(value) {
      let html = this.$refs[this.id].invoke('getHtml');
      let markdown = this.$refs[this.id].invoke('getMarkdown');
      this.$emit('input', markdown);
      this.$emit('change', html);
    },
    uploadImg(file, callback) {
      // 第一步.将图片上传到服务器.
      var formdata = new FormData();
      formdata.append('image', file);
      axios({
        url: '/api/upload/files',
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then((result) => {
        if (result.status === 200 && result.data && result.data.data) {
          callback(result.data.data.path);
        }
      });
    },
    destroyEditor() {
      // if (!this.editor) return;
      // this.editor.off('change');
      // this.editor.remove();
    },
  },
};
</script>
<style scope>
.myEditor .tui-editor-defaultUI {
  -webkit-box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  border-radius: 4px;
  overflow: hidden;
}
</style>

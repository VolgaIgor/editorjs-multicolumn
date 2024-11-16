import './index.css';

import ToolboxIcon from './svg/toolbox.svg'

import Column2Icon from './svg/column_2.svg'
import Column3Icon from './svg/column_3.svg'

/**
 * Multicolumn Inline Tool for the Editor.js
 */
export default class Multicolumn {
  /**
   * Describe an icon and title here
   * Required if Tools should be added to the Toolbox
   * @link https://editorjs.io/tools-api#toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: ToolboxIcon,
      title: 'Multi-column',
    };
  }

  /**
   * This flag tells core that current tool supports the read-only mode
   * @link https://editorjs.io/tools-api#isreadonlysupported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * With this option, Editor.js won't handle Enter keydowns
   * @link https://editorjs.io/tools-api#enablelinebreaks
   *
   * @returns {boolean}
   */
  static get enableLineBreaks() {
    return true;
  }


  /**
   * Class constructor
   * @param data - Previously saved data
   * @param api - Editor.js API
   * @param config - user config for Tool
   * @param readOnly - user config for Tool
   * @param block - current block API object
   * 
   * @link https://editorjs.io/tools-api#class-constructor
   */
  constructor({ data, api, config, readOnly, block }) {
    this.api = api;
    this.config = {
      editorLibrary: config.editorLibrary,
      editorTools: config.editorTools || {},
    };
    this.readOnly = readOnly;
    this.block = block;

    this._data = {
      columns: 2,
      content: []
    };
    this.data = data;

    this._nodes = [];

    this._rootNode = null;
  }

  /**
   * CSS classes
   *
   * @returns {object}
   */
  get CSS() {
    return {
      wrapper: 'cdx-multicolumn',
      node: 'cdx-multicolumn_node',
    };
  };

  /**
   * Return Tool data
   *
   * @returns {object}
   */
  get data() {
    return this._data;
  }

  /**
   * Stores all Tool's data
   *
   * @param {object} data
   */
  set data(data) {
    this._data.columns = ([2, 3].includes(data?.columns)) ? data.columns : 2;
    this._data.content = data.content || [];

    if (this._rootNode) {
      this._rootNode.style = `--multicolumn-column-count: ${this._data.columns}`;
    }

    this._renderData();
  }

  /**
   * Sets number of columns
   */
  async setColumns(count) {
    await this.save();

    const data = this.data;
    data.columns = count;
    this.data = data;
  }

  /**
   * Creates UI of a Block
   * Required
   * @link https://editorjs.io/tools-api#render
   * 
   * @returns {HTMLElement}
   */
  render() {
    const rootNode = document.createElement('div');
    rootNode.classList.add(this.CSS.wrapper, this.api.styles.block);
    rootNode.style = `--multicolumn-column-count: ${this._data.columns}`;

    this._rootNode = rootNode;
    this._renderData();

    return rootNode;
  }

  /**
   * Render elements
   */
  _renderData() {
    if (!this._rootNode) return;

    for (let i = 0; i < this.data.columns; i++) {
      const editorData = {
        blocks: this.data.content[i] || []
      };

      if (this._nodes[i]) {
        const nodeObj = this._nodes[i];
        nodeObj.editorjs.blocks.render(editorData);
      } else {
        const nodeObj = this._createNode(editorData);
      }
    }

    if (this._nodes.length > this.data.columns) {
      for (let i = this.data.columns; i < this._nodes.length; i++) {
        const nodeObj = this._nodes[i];
        nodeObj.node.remove();
        nodeObj.editorjs.destroy();
      }
      this._nodes = this._nodes.slice(0, this.data.columns);
    }
  }

  /**
   * Creates a new instance of the editor
   *
   * @returns {{node: HTMLElement, editorjs: EditorJS}}
   */
  _createNode(initialData) {
    const editorNode = document.createElement('div');
    editorNode.className = this.CSS.node;
    this._rootNode.appendChild(editorNode);

    const editorInstance = new this.config.editorLibrary({
      holder: editorNode,
      data: initialData,
      tools: this.config.editorTools,
      minHeight: 100,
      readOnly: this.readOnly,
      onChange: () => {
        this.block.dispatchChange()
      }
    });

    const nodeObj = {
      node: editorNode,
      editorjs: editorInstance
    };
    this._nodes.push(nodeObj);

    return nodeObj;
  }

  /**
   * 
   * Returns block setting elements
   * @link https://editorjs.io/tools-api#render-settings
   * 
   * @returns {object[]}
   */
  renderSettings() {
    return [
      {
        icon: Column2Icon,
        label: '2 columns',
        isActive: () => this.data.columns === 2,
        onActivate: () => this.setColumns(2),
        closeOnActivate: true
      },
      {
        icon: Column3Icon,
        label: '3 columns',
        isActive: () => this.data.columns === 3,
        onActivate: () => this.setColumns(3),
        closeOnActivate: true
      }
    ];
  }

  /**
   * Extracts Block data from the UI
   * Required
   * @link https://editorjs.io/tools-api#save
   * 
   * @returns {object} saved data
   */
  async save() {
    for (let index in this._nodes) {
      const saveData = await this._nodes[index].editorjs.save();
      this._data.content[index] = saveData?.blocks || [];
    }

    return {
      columns: this.data.columns,
      content: this.data.content.slice(0, this.data.columns)
    };
  }
}

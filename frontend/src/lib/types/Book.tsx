
export interface Book {
    _id: string;
    title: string;
    cover: string;
    isbn: string;
    path: string;
    pubdate: string;
    author: string;
    lastReadAt?: string;
}

export interface ContentChild {
    type: number;
    text?: string;
    tag?: string;
    children?: ContentChild[];
    attrs?: Record<string, any>;
  }
  
export interface ContentBlock {
    tag: string;
    type: number;
    children?: ContentChild[];
    attrs: Record<string, any>;
  }


import "./EditorPanel.css";
import "@mdxeditor/editor/style.css";
import "github-markdown-css";
import { Note, NoteState } from "../model";
import Empty from "./Empty";
import ProgressIndicator from "./ProgressIndicator";
import {
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  MDXEditorMethods,
  quotePlugin,
  thematicBreakPlugin,
} from "@mdxeditor/editor";
import { useEffect, useRef } from "react";

function EditorPanel(props: { note: Note | undefined }) {
  const note = props.note;

  // TODO: maybe integrate this better with the rest of the ui logic
  const ref = useRef<MDXEditorMethods>(null);
  useEffect(() => {
    let noteText = "";
    if (note?.state == NoteState.Loaded) {
      noteText = note.text;
    }
    ref.current?.setMarkdown(noteText);
  }, [note]);

  if (note == undefined) {
    return (
      <div className="editor-panel">
        <Empty />
      </div>
    );
  }

  if (note.state == NoteState.Ref) {
    return (
      <div className="editor-panel">
        <ProgressIndicator />
      </div>
    );
  }
  if (note.state == NoteState.Loading) {
    return (
      <div className="editor-panel">
        <ProgressIndicator />
      </div>
    );
  }

  if (note.state == NoteState.Loaded) {
    return (
      <div className="editor-panel">
        <div className="editor-panel-left" />
        <div className="editor-panel-inner">
          <MDXEditor
            contentEditableClassName="markdown-body"
            ref={ref}
            markdown=""
            plugins={[
              headingsPlugin(),
              listsPlugin(),
              quotePlugin(),
              thematicBreakPlugin(),
              markdownShortcutPlugin(),
            ]}
          />
        </div>
        <div className="editor-panel-right" />
      </div>
    );
  }

  return (
    <div className="editor-panel">
      <Empty />
    </div>
  );
}

export default EditorPanel;

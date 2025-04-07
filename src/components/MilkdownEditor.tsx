import "./MilkdownEditor.css";
import {
  configureLinkTooltip,
  linkTooltipPlugin,
} from "@milkdown/kit/component/link-tooltip";
import {
  defaultValueCtx,
  Editor,
  EditorStatus,
  editorViewCtx,
  editorViewOptionsCtx,
  rootCtx,
  serializerCtx,
} from "@milkdown/kit/core";
import { clipboard } from "@milkdown/kit/plugin/clipboard";
import { history } from "@milkdown/kit/plugin/history";
import { indent } from "@milkdown/kit/plugin/indent";
import { commonmark, linkAttr } from "@milkdown/kit/preset/commonmark";
import { gfm } from "@milkdown/kit/preset/gfm";
import { Milkdown } from "@milkdown/react";
import { useEffect } from "react";

// TODO: const SAVE_DRAFT_INTERVAL = 3000;

const MilkdownEditor = function MilkdownEditor(props: {
  noteId: string;
  defaultMarkdown: string;
  editable: boolean;
  deleted: boolean;
  getMarkdownRef: { getMarkdown: () => string | undefined };
}) {
  const noteId = props.noteId;
  const defaultMarkdown = props.defaultMarkdown;
  const editable = props.editable;
  const deleted = props.deleted;
  const getMarkdownRef = props.getMarkdownRef;

  // TODO: add toolbar with commands (https://milkdown.dev/docs/guide/commands)
  // TODO: if I need to access it somewhere else, `useInstance()` hook is to the rescue
  // TODO: review plugins (https://milkdown.dev/docs/plugin/using-plugins)
  // TODO: try to support subscript and superscript
  // TODO: Spellchecking in code blocks is annoying, however it only happens in editing mode
  // TODO: ESC should cancel?

  useEffect(() => {
    const editor = Editor.make()
      .config((ctx) => {
        // attach to #editor
        ctx.set(rootCtx, "#editor");
        // pass the initial value
        ctx.set(defaultValueCtx, defaultMarkdown);
        // when editing is enabled, the editor eats clicks, so using linkTooltipPlugin
        ctx.set(linkAttr.key, () => ({ target: "_blank" }));
        // update editor attributes
        ctx.update(editorViewOptionsCtx, (prev) => ({
          ...prev,
          attributes: {
            // set the class to apply 'github-markdown-css'
            class: deleted
              ? "markdown-body note-text-deleted"
              : "markdown-body",
          },
          editable: () => editable,
        }));
        // this is for link tooltip
        configureLinkTooltip(ctx);
      })
      .use(commonmark)
      .use(gfm)
      .use(linkTooltipPlugin)
      .use(history) // undo-redo
      .use(clipboard) // md-aware copy-paste
      .use(indent)
      .create();

    editor.then((editor) => {
      const getMarkdown = () => {
        if (editor.status == EditorStatus.Created) {
          return editor.action((ctx) => {
            const editorView = ctx.get(editorViewCtx);
            const serializer = ctx.get(serializerCtx);
            return serializer(editorView.state.doc);
          });
        }
        return undefined;
      };
      getMarkdownRef.getMarkdown = getMarkdown;
    });

    /* TODO:
    const editorAndInterval = editor.then((editor) => {
      // function to return the markdown as string
      const getMarkdown = () =>
        editor.action((ctx) => {
          const editorView = ctx.get(editorViewCtx);
          const serializer = ctx.get(serializerCtx);
          return serializer(editorView.state.doc);
        });

      // report markdown every 3 seconds
      const intervalId = setInterval(
        () => saveDraft(getMarkdown()),
        SAVE_DRAFT_INTERVAL
      );
      return { editor, intervalId };
    });*/

    // properly destroy
    return () => {
      editor.then((editor) => {
        getMarkdownRef.getMarkdown = () => undefined;
        // TODO: clearInterval(x.intervalId);
        editor.destroy();
      });
    };
  }, [noteId, editable, getMarkdownRef, defaultMarkdown, deleted]);

  return <Milkdown />;
};

export default MilkdownEditor;

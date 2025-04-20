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
  remarkStringifyOptionsCtx,
  rootCtx,
  serializerCtx,
} from "@milkdown/kit/core";
import { clipboard } from "@milkdown/kit/plugin/clipboard";
import { history } from "@milkdown/kit/plugin/history";
import { indent } from "@milkdown/kit/plugin/indent";
import { commonmark, linkAttr } from "@milkdown/kit/preset/commonmark";
import { gfm } from "@milkdown/kit/preset/gfm";
import { Milkdown } from "@milkdown/react";
import { memo, useEffect, useState } from "react";

const MilkdownEditor = memo(function MilkdownEditor(props: {
  noteId: string;
  defaultMarkdown: string;
  editable: boolean;
  deleted: boolean;
  getMarkdownRef: { getMarkdown: () => string | undefined };
  onError: (err: string) => void;
}) {
  const noteId = props.noteId;
  const defaultMarkdown = props.defaultMarkdown;
  const editable = props.editable;
  const deleted = props.deleted;
  // The documented solution to get the md from another component didn't work
  const getMarkdownRef = props.getMarkdownRef;
  const onError = props.onError;

  const [error, setError] = useState<string>("");

  // TODO: add toolbar with commands (https://milkdown.dev/docs/guide/commands)
  // TODO: if I need to access it somewhere else, `useInstance()` hook is to the rescue - didn't work
  // TODO: review plugins (https://milkdown.dev/docs/plugin/using-plugins)
  // TODO: try to support subscript and superscript
  // TODO: Spellchecking in code blocks is annoying, however it only happens in editing mode
  // TODO: ESC should cancel? Cannot find the way to handle this event
  // TODO: empty editor inserts '<br />\n' that I have to remove later; sometimes non-empty editor does this too

  useEffect(() => {
    setError("");

    const editor = Editor.make()
      .config((ctx) => {
        // attach to #editor
        ctx.set(rootCtx, "#editor");
        // pass the initial value
        ctx.set(defaultValueCtx, defaultMarkdown);
        // control serialization
        ctx.set(remarkStringifyOptionsCtx, {
          bullet: "-",
        });
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

    const cleanupContainer = editor
      .then((editor) => {
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

        // allow querying the current markdown from above
        getMarkdownRef.getMarkdown = getMarkdown;

        return () => {
          getMarkdownRef.getMarkdown = () => undefined;
          editor.destroy();
        };
      })
      .catch((err) => {
        setError(() => err.toString());
        onError(err.toString());

        return () => {
          getMarkdownRef.getMarkdown = () => undefined;
        };
      });

    // properly destroy
    return () => {
      cleanupContainer.then((cleanup) => cleanup());
    };
  }, [noteId, editable, getMarkdownRef, defaultMarkdown, deleted, onError]);

  return error ? (
    <div className="milkdown-error-state">{error}</div>
  ) : (
    <Milkdown />
  );
});

export default MilkdownEditor;

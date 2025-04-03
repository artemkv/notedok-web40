import "./MilkdownEditor.css";
import {
  configureLinkTooltip,
  linkTooltipPlugin,
} from "@milkdown/kit/component/link-tooltip";
import {
  defaultValueCtx,
  Editor,
  editorViewOptionsCtx,
  rootCtx,
} from "@milkdown/kit/core";
import { clipboard } from "@milkdown/kit/plugin/clipboard";
import { history } from "@milkdown/kit/plugin/history";
import { indent } from "@milkdown/kit/plugin/indent";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { gfm } from "@milkdown/kit/preset/gfm";
import { Milkdown } from "@milkdown/react";
import { useEffect } from "react";

// TODO: const SAVE_DRAFT_INTERVAL = 3000;

const MilkdownEditor = function MilkdownEditor(props: {
  noteId: string;
  editable: boolean;
  defaultMarkdown: string;
}) {
  const noteId = props.noteId;
  const editable = props.editable;
  const defaultMarkdown = props.defaultMarkdown;

  // TODO: add toolbar with commands (https://milkdown.dev/docs/guide/commands)
  // TODO: if I need to access it somewhere else, `useInstance()` hook is to the rescue
  // TODO: review plugins (https://milkdown.dev/docs/plugin/using-plugins)

  useEffect(() => {
    const editor = Editor.make()
      .config((ctx) => {
        // attach to #editor
        ctx.set(rootCtx, "#editor");
        // pass the initial value
        ctx.set(defaultValueCtx, defaultMarkdown);
        // TODO: this works, but editor eats clicks, so using linkTooltipPlugin
        // ctx.set(linkAttr.key, () => ({ target: "_blank" }));
        // update editor attributes
        ctx.update(editorViewOptionsCtx, (prev) => ({
          ...prev,
          attributes: {
            // set the class to apply 'github-markdown-css'
            class: "markdown-body",
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
        // TODO: clearInterval(x.intervalId);
        editor.destroy();
      });
    };

    // TODO: actually review this
    // this is on purpose. Only reload editor when noteId or editor status change
    // the default markdown may update, but it can be stale
    // the most latest state is ephemeral, and is found inside the editor itself
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId, editable]);

  return <Milkdown />;
};

export default MilkdownEditor;

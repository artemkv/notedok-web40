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

const MilkdownEditor = function MilkdownEditor(props: {
  noteId: string;
  defaultMarkdown: string;
}) {
  const defaultMarkdown = props.defaultMarkdown;
  const noteId = props.noteId;

  // TODO: getting md string: https://milkdown.dev/docs/guide/interacting-with-editor, Using Actions
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

    // properly destroy
    return () => {
      editor.then((e) => e.destroy());
    };
    // this is on purpose. Only reload editor when noteId changes
    // the default markdown may update, but it can be stale
    // the most latest state is ephemeral, and is found inside the editor itself
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId]);

  return <Milkdown />;
};

export default MilkdownEditor;

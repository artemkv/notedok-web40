import { useState, useEffect, useCallback, useRef } from "react";

export type Dispatch<E> = (event: E) => void;
export type Reducer<S, E> = (state: S, event: E) => [S, Command<E>];
export interface Command<E> {
  execute: (dispatch: Dispatch<E>) => void;
}

interface NoCommand {
  hasCommand: false;
}

interface HasCommand<E> {
  hasCommand: true;
  command: Command<E>;
}

type PendingCommand<E> = NoCommand | HasCommand<E>;

interface PendingCommandContainer<E> {
  pendingCommand: PendingCommand<E>;
}

const NoPendingCommand: NoCommand = { hasCommand: false };

const getPendingCommand = <E>(command: Command<E>): HasCommand<E> => {
  return {
    hasCommand: true,
    command,
  };
};

const useReducer = <S, E>(
  reducer: Reducer<S, E>,
  initialState: S,
  initialCommand: Command<E>
): [S, Dispatch<E>] => {
  const [state, setState] = useState<S>(initialState);
  // prevents command from executing the second time
  const commandContainerRef = useRef<PendingCommandContainer<E>>({
    pendingCommand: NoPendingCommand,
  });

  const dispatch = useCallback(
    (event: E) => {
      setState((state) => {
        const [newState, command] = reducer(state, event);

        commandContainerRef.current.pendingCommand = getPendingCommand(command);
        setTimeout(() => {
          const pendingCommand = commandContainerRef.current.pendingCommand;
          if (pendingCommand.hasCommand) {
            commandContainerRef.current.pendingCommand = NoPendingCommand;
            pendingCommand.command.execute(dispatch);
          }
        }, 0);

        return newState;
      });
    },
    [reducer]
  );

  useEffect(() => {
    setTimeout(() => {
      initialCommand.execute(dispatch);
    }, 0);
  }, [initialCommand, dispatch]);

  return [state, dispatch];
};

export default useReducer;

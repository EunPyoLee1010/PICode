import { Worker } from "cluster";

export interface terminal {
    socket: WebSocket;
    worker: Worker;
}

export type UUIDToWorker = {
    [key in string]: terminal;
};

export interface TCommandData {
    type: "command" | "exit" | "setup";
    command?: string;
    setupData?: {
        projectId: string;
        size: { cols: number; rows: number };
    };
}

import { Server, Socket } from "socket.io";
import { type CommandType, cmdType } from "./types.ts";

const io = new Server(0, {
  cors: {
    origin: "*",
  },
});

function run(cmd: CommandType, socket: Socket) {
  switch (cmd.cmd) {
    case cmdType.OPEN:
      break;
    case cmdType.CLOSE:
      break;
    case cmdType.MESSAGE:
      break;
    case cmdType.JOIN:
      if (cmd.triviabId) {
        socket.join(cmd.triviabId);
        updateClientCount(cmd.triviabId);
      }
      break;
    case cmdType.LEAVE:
      if (cmd.triviabId) {
        socket.leave(cmd.triviabId);
        updateClientCount(cmd.triviabId);
      }
      break;
    case cmdType.OPEN_ROOM:
      console.log("Abriendo sala");
      if (!cmd.triviabId) return;

      io.to(cmd.triviabId).emit("message", {
        cmd: cmdType.OPEN_ROOM,
        userId: cmd.userId,
        triviabId: cmd.triviabId,
        message: "opened",
      });
      break;
    default:
      break;
  }
}

const wsHosts: Map<string, { socketId: string; userId: string }> = new Map();

function updateClientCount(triviabId: string) {
  const room = io.sockets.adapter.rooms.get(triviabId);
  const size = room ? room.size : 0;

  const host = wsHosts.get(triviabId);
  if (host) {
    io.to(host.socketId).emit("message", {
      cmd: cmdType.CLIENT_COUNT,
      userId: null,
      triviabId,
      message: size.toString(),
    });
  }
}

io.on("connection", (socket) => {
  const { userid, triviabId } = socket.handshake.query as {
    userid?: string;
    triviabId?: string;
  };

  if (triviabId) {
    socket.join(triviabId);

    if (userid && userid === "fmi1") {
      wsHosts.set(triviabId, { socketId: socket.id, userId: userid });
    }

    updateClientCount(triviabId);
  }

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
    if (triviabId) {
      updateClientCount(triviabId);

      const room = io.sockets.adapter.rooms.get(triviabId);
      if (!room || room.size === 0) {
        console.log(`Grupo ${triviabId} eliminado por estar vacío.`);
        wsHosts.delete(triviabId);
      }
    }
  });

  socket.on("message", (data) => {
    console.log("Mensaje recibido", data);
    try {
      run(JSON.parse(data), socket);
    } catch (err) {
      console.error("Error al parsear mensaje", err);
    }
  });
});

export default io;

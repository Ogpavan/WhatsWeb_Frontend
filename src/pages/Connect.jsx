import { useEffect, useState, useRef } from "react";
import { Button } from "../components/ui/button";
import {
  Loader2,
  WifiOff,
  CheckCircle,
  RefreshCw,
  Timer,
  Smartphone,
  Laptop,
  Clock,
  X,
} from "lucide-react";

function Connect() {
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [qrTimer, setQrTimer] = useState(null);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [sessionUser, setSessionUser] = useState("John Doe"); // Replace with actual session user logic
  const [sessionPhone, setSessionPhone] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const qrIntervalRef = useRef(null);

  const MAX_RECONNECT_ATTEMPTS = 5;
  const QR_VALIDITY_SECONDS = 30;

  useEffect(() => {
    connectWS();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current)
        clearTimeout(reconnectTimeoutRef.current);
      if (qrIntervalRef.current) clearInterval(qrIntervalRef.current);
    };
  }, []);

  function connectWS() {
    try {
      wsRef.current = new window.WebSocket("ws://localhost:5000");

      wsRef.current.onopen = () => {
        setError(null);
        setConnectionAttempts(0);
        setStatus("Connected to server");
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.qr) {
            setTimeout(() => {
              setQr(`data:image/png;base64,${data.qr}`);
              setLoading(false);
              setStatus("Scan QR with WhatsApp");
              startQrTimer();
            }, 600);
          }

          if (data.sessions) {
            setConnectedDevices(
              (Array.isArray(data.sessions) ? data.sessions : []).map((s) => {
                // Extract 10 digit number from id (e.g., '917302667115:47@s.whatsapp.net')
                let phone = "-";
                if (s.id) {
                  const match = s.id.match(/(\d{10,})/);
                  if (match) {
                    // Always get the last 10 digits (Indian mobile number)
                    phone = match[1].slice(-10);
                  }
                }
                return {
                  id: s.id || "-",
                  name: s.name || "Mobile",
                  phone,
                  lastSeen: s.connectedAt
                    ? new Date(s.connectedAt).toLocaleString()
                    : "-",
                  type: "phone",
                };
              })
            );
          }

          if (data.status) {
            setStatus(data.status);

            if (data.status.toLowerCase().includes("connected")) {
              setQr(null);
              setError(null);
            }

            if (data.status.toLowerCase().includes("disconnected")) {
              setQr(null);
            }
          }
        } catch (e) {
          setError("Failed to parse server message");
        }
      };

      wsRef.current.onerror = () => {
        setError("Connection error");
        setStatus("WebSocket error");
      };

      wsRef.current.onclose = () => {
        const attempts = connectionAttempts + 1;
        setConnectionAttempts(attempts);

        if (attempts <= MAX_RECONNECT_ATTEMPTS) {
          setStatus(
            `Connection closed. Reconnecting (${attempts}/${MAX_RECONNECT_ATTEMPTS})...`
          );
          const timeout = Math.min(2000 * attempts, 10000); // Exponential backoff capped at 10s
          reconnectTimeoutRef.current = setTimeout(connectWS, timeout);
        } else {
          setError("Failed to connect after multiple attempts");
          setStatus("Connection failed. Please try again later.");
        }
      };
    } catch (err) {
      setError("Failed to establish connection");
      setStatus("Unable to connect to server");
    }
  }

  function startQrTimer() {
    setQrTimer(QR_VALIDITY_SECONDS);
    if (qrIntervalRef.current) clearInterval(qrIntervalRef.current);
    qrIntervalRef.current = setInterval(() => {
      setQrTimer((prev) => {
        if (prev === 1) {
          clearInterval(qrIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  const handleConnect = () => {
    setLoading(true);
    setStatus("Waiting for QR code...");
    setError(null);

    // If we had a previous connection error, try reconnecting
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      connectWS();
    }
  };

  const handleRetry = () => {
    setConnectionAttempts(0);
    setError(null);
    connectWS();
    setStatus("Reconnecting...");
  };

  const handleDisconnectDevice = (deviceId) => {
    // In a real app, you would send a disconnect message to the server
    // For now, we'll just remove it from the local state
    setConnectedDevices((devices) =>
      devices.filter((device) => device.id !== deviceId)
    );
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case "phone":
        return <Smartphone className="h-5 w-5" />;
      case "laptop":
        return <Laptop className="h-5 w-5" />;
      default:
        return <Smartphone className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex items-start justify-center h-full min-h-[500px] ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-6xl">
        {/* Left column - QR and connection */}

        {/* Right column - Connected sessions table */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] border-[1px] border-gray-50 dark:border-slate-800 p-4 flex flex-col    ">
          <h3 className="h3 text-slate-800 dark:text-slate-100 mb-4">
            Connected Sessions
          </h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-emerald-50 dark:bg-green-900/10">
                <th className="py-2 px-2 text-left font-semibold text-slate-700 dark:text-slate-200">
                  Name
                </th>
                <th className="py-2 px-2 text-left font-semibold text-slate-700 dark:text-slate-200">
                  Phone
                </th>
                <th className="py-2 px-2 text-left font-semibold text-slate-700 dark:text-slate-200">
                  Connected at
                </th>
                <th className="py-2 px-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {connectedDevices.map((device) => (
                <tr
                  key={device.id}
                  className="border-b border-gray-100 dark:border-slate-800"
                >
                  <td className="py-2 px-2 flex items-center gap-2">
                    {getDeviceIcon(device.type)}
                    <span>{device.name}</span>
                  </td>
                  <td className="py-2 px-2">
                    {device.phone || sessionPhone || "-"}
                  </td>
                  <td className="py-2 px-2">{device.lastSeen}</td>
                  <td className="py-2 px-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 dark:border-red-800"
                      onClick={() => handleDisconnectDevice(device.id)}
                    >
                      Logout
                    </Button>
                  </td>
                  <td>
                    <input
                      type="radio"
                      name="activeSession"
                      checked={selectedSessionId === device.id}
                      onChange={() => setSelectedSessionId(device.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className=" bg-white dark:bg-slate-900 rounded shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] border-[1px] border-gray-50 dark:border-slate-800 p-4">
          <h3 className=" text-center pb-2">WhatsApp Connection</h3>

          <div className="relative w-full aspect-square max-w-[300px] mx-auto mb-4 rounded-lg overflow-hidden">
            {error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-800 rounded-lg border">
                <WifiOff className="h-12 w-12 text-red-500 mb-3" />
                <p className="text-sm font-medium text-red-500 text-center px-4">
                  {error}
                </p>
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  className="mt-4 flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry Connection
                </Button>
              </div>
            ) : (
              <img
                src={qr ? qr : "/dummyqr.webp"}
                alt={qr ? "WhatsApp QR Code" : "Placeholder QR"}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  !qr ? "blur-md opacity-60" : "blur-0 opacity-100"
                }`}
              />
            )}

            {!qr && !error && (
              <div className="absolute inset-0 flex items-center justify-center">
                {!loading ? (
                  <Button
                    className="px-8 py-6 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-base shadow-md"
                    onClick={handleConnect}
                  >
                    Connect WhatsApp
                  </Button>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
                    <p className="text-base font-medium text-white">
                      Generating QR...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* QR Timer */}
          {qr && qrTimer !== null && qrTimer > 0 && (
            <div className="flex items-center justify-center gap-2 mb-2 text-sm text-gray-700 dark:text-gray-300">
              <Timer className="h-4 w-4" />
              <span>
                <span className="font-semibold">{qrTimer}s</span> left for this
                QR
              </span>
            </div>
          )}

          <div
            className={`mt-4 px-4 py-2 rounded-md text-center ${
              status.toLowerCase().includes("connected")
                ? "  text-green-700 dark:bg-green-900/20 dark:text-green-400"
                : error
                ? "  text-red-700 dark:bg-red-900/20 dark:text-red-400"
                : "  text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {status.toLowerCase().includes("connected") && (
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">{status}</span>
              </div>
            )}
            {!status.toLowerCase().includes("connected") && (
              <span className="text-base">{status || "Ready to connect"}</span>
            )}
          </div>
          <p className="small text-center mt-4">
            Scan the QR code with your WhatsApp mobile app to connect
          </p>
        </div>
      </div>
    </div>
  );
}

export default Connect;

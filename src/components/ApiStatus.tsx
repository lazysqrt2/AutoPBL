import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { showError, showSuccess } from "@/utils/toast";

const ApiStatus = () => {
  const [status, setStatus] = useState<"checking" | "connected" | "error">("checking");
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkApiStatus = async () => {
    setStatus("checking");
    
    try {
      const response = await fetch("/api/health");
      
      if (response.ok) {
        setStatus("connected");
        setLastChecked(new Date());
        console.log("API health check successful");
      } else {
        setStatus("error");
        setLastChecked(new Date());
        console.error("API health check failed:", await response.text());
      }
    } catch (error) {
      setStatus("error");
      setLastChecked(new Date());
      console.error("API health check error:", error);
    }
  };

  useEffect(() => {
    checkApiStatus();
    
    // 每60秒检查一次API状态
    const interval = setInterval(checkApiStatus, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleManualCheck = () => {
    checkApiStatus();
    showSuccess("API status check initiated");
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
      <div className={`w-3 h-3 rounded-full ${
        status === "connected" ? "bg-green-500" : 
        status === "error" ? "bg-red-500" : 
        "bg-yellow-500"
      }`}></div>
      
      <div className="text-sm">
        API Status: 
        <span className={`ml-1 font-medium ${
          status === "connected" ? "text-green-600" : 
          status === "error" ? "text-red-600" : 
          "text-yellow-600"
        }`}>
          {status === "connected" ? "Connected" : 
           status === "error" ? "Error" : 
           "Checking..."}
        </span>
      </div>
      
      {lastChecked && (
        <div className="text-xs text-gray-500">
          Last checked: {lastChecked.toLocaleTimeString()}
        </div>
      )}
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleManualCheck}
        className="text-xs"
      >
        Check
      </Button>
    </div>
  );
};

export default ApiStatus;
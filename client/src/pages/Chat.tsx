import { Input } from "../components/catalyst/input";
import { Button } from "../components/catalyst/button";
import { useState, useEffect, useRef } from "react";
import { Avatar } from "../components/catalyst/avatar";
import { Navbar } from "../components/catalyst/navbar";

const allMessages = {
  1: [
    { id: 1, sender: "Alice", text: "Salut! Cum ești?" },
    { id: 2, sender: "Tu", text: "Bine, mulțumesc! Tu?" },
  ],
  2: [
    { id: 1, sender: "Bob", text: "Ne vedem mâine?" },
    { id: 2, sender: "Tu", text: "Da, sigur!" },
  ],
};

function ChatMessages({ conversationId }) {
    const [messages, setMessages] = useState(allMessages[conversationId] || []);
    const [newMessage, setNewMessage] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      setMessages(allMessages[conversationId] || []);
      setNewMessage("");
    }, [conversationId]);
  
    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
  
    const handleSendMessage = () => {
      if (newMessage.trim() !== "") {
        const updated = [...messages, { id: Date.now(), sender: "Tu", text: newMessage }];
        setMessages(updated);
        allMessages[conversationId] = updated;
        setNewMessage("");
      }
    };
  
    return (
      <div className="flex flex-col flex-1">
        {/* Mesaje */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[70%] px-4 py-2 rounded-lg text-sm ${
                msg.sender === "Tu"
                  ? "ml-auto bg-blue-500 text-white"
                  : "mr-auto bg-gray-100 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
  
        {/* Input jos */}
        <div className="border-t pt-4 bg-white mt-4">
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              placeholder="Scrie un mesaj..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSendMessage}>Trimite</Button>
          </div>
        </div>
      </div>
    );
  }
  

export const Chat = () => {
  const conversations = [
    { id: 1, name: "Alice", lastMessage: "Salut! Cum ești?", avatar: "/avatars/alice.jpg" },
    { id: 2, name: "Bob", lastMessage: "Ne vedem mâine?", avatar: "/avatars/bob.jpg" },
  ];
  const [selectedConversation, setSelectedConversation] = useState(conversations[0].id);

  return (
    <div className="lex flex-col">
      {/* Navbar sus */}
      <Navbar />

      {/* Conținut principal */}
      <div className="flex flex-1">
        {/* Sidebar conversații */}
        <div className="w-[300px] border-r bg-gray-50 p-4">
          <Input type="text" placeholder="Caută conversații..." className="mb-4" />
          <div className="space-y-1">
            {conversations.map(({ id, name, lastMessage, avatar }) => (
              <div
                key={id}
                onClick={() => setSelectedConversation(id)}
                className={`flex items-center gap-3 p-2 rounded-md cursor-pointer ${
                  selectedConversation === id ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                <Avatar src={avatar} />
                <div className="overflow-hidden">
                  <div className="font-medium truncate">{name}</div>
                  <div className="text-sm text-gray-500 truncate">{lastMessage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fereastră chat */}
        <div className="flex-1 p-4">
          <ChatMessages conversationId={selectedConversation} />
        </div>
      </div>
    </div>
  );
};

package com.example.flownary.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
@Controller
public class WebSocketEventListener {

    private static final Set<String> SESSION_IDS = new HashSet<>();
    private static final Map<String, String> USER_SESSIONS = new HashMap<>(); // <sessionId, userId>
    private static final Map<String, String> USER_PAGE = new HashMap<>(); // <userId, page>

    @EventListener
    public void onConnect(SessionConnectEvent event) {
        String sessionId = event.getMessage().getHeaders().get("simpSessionId").toString();
        SESSION_IDS.add(sessionId);
        log.info("[connect] connections : {}", SESSION_IDS.size());
        
        String userId = USER_PAGE.getOrDefault(sessionId, null);
        if (userId != null) {
            USER_SESSIONS.put(sessionId, userId);
        }
    }

    @EventListener
    public void onDisconnect(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        SESSION_IDS.remove(sessionId);
        USER_SESSIONS.remove(sessionId);
        USER_PAGE.entrySet().removeIf(entry -> entry.getValue().equals(sessionId));
        log.info("[disconnect] connections : {}", SESSION_IDS.size());
    }

	@MessageMapping("/userset")
    public void handleWebSocketMessage(@Payload Map<String, Object> payload, StompHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        log.info("Received sessionId: {}", sessionId);
        log.info("Received message: {}", payload);
        
        int userId = (Integer) payload.get("userId");
        String action = (String) payload.get("action");

        if ("enter".equals(action)) {
            USER_SESSIONS.put(sessionId, Integer.toString(userId));
        } else if ("leave".equals(action)) {
            USER_SESSIONS.remove(sessionId);
        }

        log.info("User {} WebSocket {}", userId, action);
    }
	
	@MessageMapping("/page")
	public void handleWebSocketMessagePage(@Payload Map<String, Object> payload) {
        log.info("Received message: {}", payload);
        
        int userId = (Integer) payload.get("userId");
        String page = (String) payload.get("page");
        String action = (String) payload.get("action");

        if ("enter".equals(action)) {
            USER_PAGE.put(Integer.toString(userId), page);
        } else if ("leave".equals(action)) {
            USER_PAGE.remove(Integer.toString(userId));
        }

        log.info("User {} {} page {}", userId, action, page);
    }

    public boolean isUserOnPage(int userId, String page) {
        return page.equals(USER_PAGE.get(Integer.toString(userId)));
    }
    
    public boolean isUserOnConnected(int userId) {
//    	return USER_PAGE.containsKey(Integer.toString(userId));
    	return USER_SESSIONS.containsValue(Integer.toString(userId));
    }
}

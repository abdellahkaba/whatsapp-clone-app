package com.isi.whatsappclone.common;


import com.isi.whatsappclone.message.MessageState;
import com.isi.whatsappclone.message.MessageType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class BaseAuditingEntity {

    @Id
    @SequenceGenerator(name = "msg_seq", sequenceName = "msg_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "msg_seq")
    private Long id;
    @Column(columnDefinition = "TEXT")
    @Enumerated(EnumType.STRING)
    private MessageState state;
    private MessageType type;

    @Column(name = "sender_id", nullable = false)
    private String senderId;
    @Column(name = "receiver_id", nullable = false)
    private String receiverId;
}

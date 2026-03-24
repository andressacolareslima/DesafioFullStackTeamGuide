package com.example.demo.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.ReadOnlyProperty;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.relational.core.mapping.Column;

@Data
@Table("candidaturas")
public class CandidaturasModel {
    @Id
    private Long id;
    
    @Column("vaga_id")
    private Long vagaId; 
    
    @Column("nome_candidato")
    private String nomeCandidato;
    
    @Column("email_candidato")
    private String emailCandidato;
    
    private String status; 

    @ReadOnlyProperty
    @Column("titulo_vaga")
    private String tituloVaga; 
}
package com.example.demo.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("candidaturas")
public class CandidaturasModel {
    @Id
    private Long id;
    private Long vagaId; 
    private String nomeCandidato;
    private String emailCandidato;
    private String status; 
}
package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidaturaDTO {
    private Long id;
    private String nomeCandidato;
    private String emailCandidato;
    private String status;
    private String tituloVaga; 
}
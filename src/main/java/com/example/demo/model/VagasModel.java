package com.example.demo.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("vagas")

public class VagasModel {

    @Id
    private Long id; 
    private String titulo; 
    private String area; 
    private String tipo;
    private String status;
    
}

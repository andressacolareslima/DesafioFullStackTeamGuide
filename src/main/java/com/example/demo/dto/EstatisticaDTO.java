package com.example.demo.dto;

import org.springframework.data.annotation.PersistenceCreator;

public class EstatisticaDTO {
    private String rotulo;
    private Long quantidade;

    public EstatisticaDTO() {}

    @PersistenceCreator
    public EstatisticaDTO(String rotulo, Long quantidade) {
        this.rotulo = rotulo;
        this.quantidade = quantidade;
    }

    public String getRotulo() { return rotulo; }
    public void setRotulo(String rotulo) { this.rotulo = rotulo; }
    public Long getQuantidade() { return quantidade; }
    public void setQuantidade(Long quantidade) { this.quantidade = quantidade; }
}

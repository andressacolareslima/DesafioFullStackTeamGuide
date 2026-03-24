package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.demo.repository.CandidaturasRepository;
import com.example.demo.dto.EstatisticaDTO;

@RestController
@RequestMapping("/api/estatisticas")
@CrossOrigin(origins = "*") 
public class EstatisticasController {

    private final CandidaturasRepository repository;

    public EstatisticasController(CandidaturasRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/vagas")
    public List<EstatisticaDTO> estatisticasVagas() {
        return repository.countCandidaturasPorVaga();
    }

    @GetMapping("/status")
    public List<EstatisticaDTO> estatisticasStatus() {
        return repository.countCandidaturasPorStatus();
    }
}

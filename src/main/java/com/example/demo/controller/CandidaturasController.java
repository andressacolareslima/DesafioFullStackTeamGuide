package com.example.demo.controller;

import com.example.demo.model.CandidaturasModel;
import com.example.demo.dto.CandidaturaDTO;
import com.example.demo.repository.CandidaturasRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Arrays;

@RestController
@RequestMapping("/api/candidaturas")
@CrossOrigin(origins = "*")
public class CandidaturasController {

    private final CandidaturasRepository candidaturasRepository;

    public CandidaturasController(CandidaturasRepository candidaturasRepository) {
        this.candidaturasRepository = candidaturasRepository;
    }

    @PostMapping
    public ResponseEntity<CandidaturasModel> criar(@RequestBody CandidaturasModel candidatura) {
        if (candidatura.getStatus() == null || candidatura.getStatus().equals("Pendente")) {
            candidatura.setStatus("em_analise");
        }
        CandidaturasModel salva = candidaturasRepository.save(candidatura);
        return ResponseEntity.ok(salva);
    }

    @GetMapping
    public ResponseEntity<List<CandidaturaDTO>> listarTodas(@RequestParam(value = "email", required = false) String email) {
        List<CandidaturasModel> lista = candidaturasRepository.findAllWithVaga();
        
        List<CandidaturaDTO> dtos = lista.stream().map(c -> new CandidaturaDTO(
            c.getId(),
            c.getNomeCandidato(),
            c.getEmailCandidato(),
            c.getStatus(),
            c.getTituloVaga()
        )).collect(Collectors.toList());

        if (email != null && !email.trim().isEmpty()) {
            dtos = dtos.stream()
                       .filter(dto -> email.equalsIgnoreCase(dto.getEmailCandidato()))
                       .collect(Collectors.toList());
        }

        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarStatus(@PathVariable("id") Long id, @RequestBody CandidaturaDTO dto) {
        candidaturasRepository.atualizarStatusManual(id, dto.getStatus());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable("id") Long id) {
        candidaturasRepository.deletarManual(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return ResponseEntity.status(500).body("EXCEPTION: " + e.getMessage() + "\n" + Arrays.toString(e.getStackTrace()));
    }
}
package com.example.demo.controller;

import com.example.demo.model.CandidaturasModel;
import com.example.demo.repository.CandidaturasRepository;
import com.example.demo.repository.VagasRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/candidaturas")
@CrossOrigin(origins = "*")
public class CandidaturasController {

    private final CandidaturasRepository candidaturasRepository;
    private final VagasRepository vagasRepository;

    public CandidaturasController(CandidaturasRepository candidaturasRepository, VagasRepository vagasRepository) {
        this.candidaturasRepository = candidaturasRepository;
        this.vagasRepository = vagasRepository;
    }

   @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody CandidaturasModel candidatura) {
        return vagasRepository.findById(candidatura.getVagaId())
            .map(vaga -> {
                if ("Fechada".equalsIgnoreCase(vaga.getStatus())) {
                    return ResponseEntity.badRequest().body("Erro: Vaga encerrada.");
                }
                if (candidatura.getStatus() == null) candidatura.setStatus("em_analise");
                CandidaturasModel salva = candidaturasRepository.save(candidatura);
                return ResponseEntity.ok(salva);
            })
            .orElse(ResponseEntity.status(404).body("Erro: Vaga não encontrada no sistema."));
    }

    // --- MODIFICAÇÃO SOLICITADA: LISTAR COM NOME DA VAGA ---
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listarTodas() {
        Iterable<CandidaturasModel> candidaturas = candidaturasRepository.findAll();

        List<Map<String, Object>> listaComNomes = StreamSupport.stream(candidaturas.spliterator(), false)
            .map(c -> {
                Map<String, Object> dto = new HashMap<>();
                dto.put("id", c.getId());
                dto.put("nomeCandidato", c.getNomeCandidato());
                dto.put("emailCandidato", c.getEmailCandidato());
                dto.put("status", c.getStatus());
                dto.put("vagaId", c.getVagaId());

                // Busca o título da vaga dinamicamente
                String titulo = vagasRepository.findById(c.getVagaId())
                    .map(vaga -> vaga.getTitulo()) 
                    .orElse("Vaga Removida");
                
                dto.put("tituloVaga", titulo); // Nome que o Front vai ler
                return dto;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(listaComNomes);
    }

    @GetMapping("/vaga/{vagaId}")
    public Iterable<CandidaturasModel> listarPorVaga(@PathVariable Long vagaId) {
        return candidaturasRepository.findByVagaId(vagaId);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CandidaturasModel> atualizarStatus(
            @PathVariable Long id, 
            @RequestParam String novoStatus) {
        return candidaturasRepository.findById(id)
            .map(c -> {
                c.setStatus(novoStatus);
                return ResponseEntity.ok(candidaturasRepository.save(c));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (candidaturasRepository.existsById(id)) {
            candidaturasRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
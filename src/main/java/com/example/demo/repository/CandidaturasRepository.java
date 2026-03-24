package com.example.demo.repository;

import com.example.demo.model.CandidaturasModel;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CandidaturasRepository extends CrudRepository<CandidaturasModel, Long> {

    @Query("SELECT * FROM candidaturas WHERE vaga_id = :vagaId ORDER BY id DESC")
    List<CandidaturasModel> findByVagaId(Long vagaId);

    @Query("SELECT * FROM candidaturas WHERE email_candidato = :email_candidato")
    List<CandidaturasModel> findByEmail(String email);

    @Modifying
    @Query("UPDATE candidaturas SET status = :novoStatus WHERE id = :id")
    void atualizarStatusManual(Long id, String novoStatus);

    @Modifying
    @Query("DELETE FROM candidaturas WHERE vaga_id = :vagaId")
    void deletarPorVaga(Long vagaId);
}
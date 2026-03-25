package com.example.demo.repository;

import com.example.demo.model.CandidaturasModel;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import com.example.demo.dto.EstatisticaDTO;

@Repository
public interface CandidaturasRepository extends CrudRepository<CandidaturasModel, Long> {

    @Query("SELECT c.*, v.titulo AS titulo_vaga " +
           "FROM candidaturas c " +
           "JOIN vagas v ON c.vaga_id = v.id " +
           "ORDER BY c.id DESC")
    List<CandidaturasModel> findAllWithVaga();

    @Modifying
    @Transactional
    @Query("UPDATE candidaturas SET status = :novoStatus WHERE id = :id")
    void atualizarStatusManual(@Param("id") Long id, @Param("novoStatus") String novoStatus);

    @Modifying
    @Transactional
    @Query("UPDATE candidaturas SET nome_candidato = :nomeCandidato WHERE id = :id")
    void atualizarNomeManual(@Param("id") Long id, @Param("nomeCandidato") String nomeCandidato);

    @Modifying
    @Transactional
    @Query("DELETE FROM candidaturas WHERE id = :id")
    void deletarManual(@Param("id") Long id);

    @Query(value = "SELECT v.titulo AS rotulo, COUNT(c.id) AS quantidade \n" +
           "FROM vagas v \n" +
           "LEFT JOIN candidaturas c ON v.id = c.vaga_id \n" +
           "GROUP BY v.id, v.titulo \n" +
           "ORDER BY quantidade DESC", rowMapperClass = com.example.demo.dto.EstatisticaRowMapper.class)
    List<EstatisticaDTO> countCandidaturasPorVaga();

    @Query(value = "SELECT status AS rotulo, COUNT(id) AS quantidade \n" +
           "FROM candidaturas \n" +
           "GROUP BY status \n" +
           "ORDER BY quantidade DESC", rowMapperClass = com.example.demo.dto.EstatisticaRowMapper.class)
    List<EstatisticaDTO> countCandidaturasPorStatus();
}
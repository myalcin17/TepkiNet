package com.mehmet.tepkinet.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.security.Keys;

import java.security.Key;

import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")

    private String SECRET_KEY;


    public String generateToken(String email) {

        Key key =
                Keys.hmacShaKeyFor(
                        SECRET_KEY.getBytes());

        return Jwts.builder()

                .setSubject(email)

                .setIssuedAt(new Date())

                .setExpiration(

                        new Date(
                                System.currentTimeMillis()
                                        + 1000 * 60 * 60
                        )
                )

                .signWith(key)

                .compact();
    }

    public String extractEmail(
            String token) {

        return Jwts.parserBuilder()

                .setSigningKey(

                        Keys.hmacShaKeyFor(
                                SECRET_KEY.getBytes())
                )

                .build()

                .parseClaimsJws(token)

                .getBody()

                .getSubject();
    }
}
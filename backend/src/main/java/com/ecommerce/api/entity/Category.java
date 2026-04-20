package com.ecommerce.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @Column(name = "category_id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long catagoryId;

    @Column(name = "category_name")
    private String catagory_Name;

    @Column(name = "category_decription")
    private String catagoryDescription;

    @OneToMany(mappedBy = "category")
    private List<Product> products;
}

-- Criação da tabela inventory_movements para registrar entradas e saídas de estoque
CREATE TABLE inventory_movements (
    movement_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL,
    movement_type VARCHAR(10) NOT NULL CHECK (movement_type IN ('entry', 'exit')),
    justification TEXT,
    movement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alteração na tabela inventory para assegurar que a quantidade reflete a soma das movimentações
ALTER TABLE inventory
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Trigger function para atualizar o estoque após uma inserção ou atualização em inventory_movements
CREATE OR REPLACE FUNCTION update_inventory()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        -- Se o movimento é uma inserção
        IF (NEW.movement_type = 'entry') THEN
            UPDATE inventory
            SET quantity = quantity + NEW.quantity,
                updated_at = CURRENT_TIMESTAMP
            WHERE product_id = NEW.product_id;
        ELSIF (NEW.movement_type = 'exit') THEN
            UPDATE inventory
            SET quantity = quantity - NEW.quantity,
                updated_at = CURRENT_TIMESTAMP
            WHERE product_id = NEW.product_id;
        END IF;
    ELSIF (TG_OP = 'UPDATE') THEN
        -- Se o movimento é uma atualização
        IF (NEW.movement_type = 'entry') THEN
            UPDATE inventory
            SET quantity = quantity + (NEW.quantity - OLD.quantity),
                updated_at = CURRENT_TIMESTAMP
            WHERE product_id = NEW.product_id;
        ELSIF (NEW.movement_type = 'exit') THEN
            UPDATE inventory
            SET quantity = quantity - (NEW.quantity - OLD.quantity),
                updated_at = CURRENT_TIMESTAMP
            WHERE product_id = NEW.product_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para chamar a função após uma inserção em inventory_movements
CREATE TRIGGER trg_insert_inventory_movements
AFTER INSERT ON inventory_movements
FOR EACH ROW
EXECUTE FUNCTION update_inventory();

-- Trigger para chamar a função após uma atualização em inventory_movements
CREATE TRIGGER trg_update_inventory_movements
AFTER UPDATE ON inventory_movements
FOR EACH ROW
EXECUTE FUNCTION update_inventory();

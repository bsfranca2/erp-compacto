-- Função que cria um registro de estoque com quantidade zero
CREATE OR REPLACE FUNCTION create_initial_inventory()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO inventory (product_id, quantity)
    VALUES (NEW.product_id, 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que chama a função após a inserção de um novo produto
CREATE TRIGGER trg_create_initial_inventory
AFTER INSERT ON products
FOR EACH ROW
EXECUTE FUNCTION create_initial_inventory();
